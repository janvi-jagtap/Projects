package datastructures.dictionaries;

import cse332.datastructures.trees.BinarySearchTree;
import datastructures.worklists.ArrayStack;

/**
 * AVLTree must be a subclass of BinarySearchTree<E> and must use
 * inheritance and calls to superclass methods to avoid unnecessary
 * duplication or copying of functionality.
 * <p>
 * 1. Create a subclass of BSTNode, perhaps named AVLNode.
 * 2. Override the insert method such that it creates AVLNode instances
 * instead of BSTNode instances.
 * 3. Do NOT "replace" the children array in BSTNode with a new
 * children array or left and right fields in AVLNode.  This will
 * instead mask the super-class fields (i.e., the resulting node
 * would actually have multiple copies of the node fields, with
 * code accessing one pair or the other depending on the type of
 * the references used to access the instance).  Such masking will
 * lead to highly perplexing and erroneous behavior. Instead,
 * continue using the existing BSTNode children array.
 * 4. Ensure that the class does not have redundant methods
 * 5. Cast a BSTNode to an AVLNode whenever necessary in your AVLTree.
 * This will result a lot of casts, so we recommend you make private methods
 * that encapsulate those casts.
 * 6. Do NOT override the toString method. It is used for grading.
 * 7. The internal structure of your AVLTree (from this.root to the leaves) must be correct
 */

public class AVLTree<K extends Comparable<? super K>, V> extends BinarySearchTree<K, V> {

    public V insert(K key, V value) {
        //Try to first see if the key exists and then just update it's value
        AVLNode prev = null;

        AVLNode curr = (AVLNode) super.root;

        //Use a stack to keep track of nodes and use it to traverse back up
        //You can add nodes to the stack and then
        ArrayStack<AVLNode> nodeStack = new ArrayStack<>();


        while (curr != null) {
            int comparison = Integer.signum(key.compareTo(curr.key));

            if (comparison == 0) {
                V oldValue = curr.value;
                curr.value = value;
                return oldValue;
            }
            else if (comparison == -1) {
                prev = curr;
                curr = (AVLNode) curr.children[0];
                nodeStack.add(prev);
            }
            else {
                prev = curr;
                curr = (AVLNode) curr.children[1];
                nodeStack.add(prev);
            }
        }

        AVLNode newNode = new AVLNode(key, value);
        newNode.height = 0;

        //Okay so now either there is nothing to begin with or we've reach the end
        if (prev == null) { //Sets the first value
            super.root = newNode;
            this.size++;
        }
        else { //Adding child
            //Now we're at a spot with prev at the leaf ready to insert so yay let's add child
            if (Integer.signum(key.compareTo(prev.key)) == -1) {
                prev.children[0] = newNode;
            } else {
                prev.children[1] = newNode;
            }
            this.size++;
        }

        //Use the stack to traverse back up the tree
        //Compare the heights of the children and make sure they're within one of each other
        //If not then do a rotation and you're done yay
            //Do RR, LL, RL, LR
        //If the heights are fine then update the node's height max(left, right) + 1
        //Continue until stack is empty

        while(nodeStack.size() != 0) {
            int leftHeight = -1;
            int rightHeight = -1;

            //Get the sizes of the children
            if (nodeStack.peek().children[0] != null) {
                AVLNode leftChild = (AVLNode) nodeStack.peek().children[0];
                leftHeight = leftChild.height;
            }
            if (nodeStack.peek().children[1] != null) {
                AVLNode rightChild = (AVLNode) nodeStack.peek().children[1];
                rightHeight = rightChild.height;
            }

            if (Math.abs(leftHeight - rightHeight) > 1) {
                //If the insertion is left-left do a right rotation
                if (Integer.signum(key.compareTo(nodeStack.peek().key)) == -1 &&
                        nodeStack.peek().children[0] != null &&
                        Integer.signum(key.compareTo(nodeStack.peek().children[0].key)) == -1) {
                    AVLNode problemNode = nodeStack.next();
                    AVLNode leftChild = (AVLNode) problemNode.children[0];
//
//                    //If the left child of problem node has a right child we assign it to
//                    //the left child of the problem node

                    problemNode.children[0] = null;
                    if (leftChild.children[1] != null) {
                       AVLNode leftChildsRightChild = (AVLNode) leftChild.children[1];
                       leftChild.children[1] = null;
                       problemNode.children[0] = leftChildsRightChild;
                    }
//
//                   //We make the problem node the right child of its left child
                    leftChild.children[1] = problemNode;
//
//                    //Have to make sure the parent of the problem node is the parent of the new one too
                    if (nodeStack.hasWork()) {
                        AVLNode parent = nodeStack.peek();
                        //Puts it in right or left depending on where problem node was
                        if (Integer.signum(problemNode.key.compareTo(parent.key)) == -1) {
                            parent.children[0] = null;
                            parent.children[0] = leftChild;
                        }
                        else {
                            parent.children[1] = null;
                            parent.children[1] = leftChild;
                        }
                    }

                    //Have to update all of their heights again
                    problemNode.height = getHeight(problemNode);
                    leftChild.height = getHeight(leftChild);
                    super.root = leftChild;
                }
                //If the insertion is right-right do a left rotation
                else if (Integer.signum(key.compareTo(nodeStack.peek().key)) == 1 &&
                        nodeStack.peek().children[1] != null &&
                        Integer.signum(key.compareTo(nodeStack.peek().children[1].key)) == 1) {

                    AVLNode problemNode = nodeStack.next();
                    AVLNode rightChild = (AVLNode) problemNode.children[1];

                    problemNode.children[1] = null;
                    //Move the rightchild's left child as the problem node's right child if it has one
                    if (rightChild.children[0] != null) {
                        AVLNode rightChildsLeftChild = (AVLNode) rightChild.children[0];
                        rightChild.children[0] = null;
                        problemNode.children[1] = rightChildsLeftChild;
                    }

                    //Make problem node the left child of right child
                    rightChild.children[0] = problemNode;

                    //Make sure the parents of the problem child are now the parents of the right child
                    if (nodeStack.hasWork()) {
                        AVLNode parent = nodeStack.peek();
                        if (Integer.signum(problemNode.key.compareTo(parent.key)) == -1) {
                            parent.children[0] = null;
                            parent.children[0] = rightChild;
                        }
                        else {
                            parent.children[1] = null;
                            parent.children[1] = rightChild;
                        }
                    }

                    //Update everyone's heights
                    problemNode.height = getHeight(problemNode);
                    rightChild.height = getHeight(rightChild);

                    super.root = rightChild;

                }
                //The insertion is left right and we do right-left rotation
                else if (Integer.signum(key.compareTo(nodeStack.peek().key)) == -1 &&
                        nodeStack.peek().children[0] != null &&
                        Integer.signum(key.compareTo(nodeStack.peek().children[0].key)) == 1) {

                    //First we would just do a left rotation with the left child as problem node
                    AVLNode problemNodeL = (AVLNode) nodeStack.peek().children[0];
                    AVLNode rightChild = (AVLNode) problemNodeL.children[1];

                    problemNodeL.children[1] = null;
                    //Set right child's left child as problemNode's right child
                    if (rightChild.children[0] != null) {
                        AVLNode rightChildsLeftChild = (AVLNode) rightChild.children[0];
                        rightChild.children[0] = null;
                        problemNodeL.children[1] = rightChildsLeftChild;
                    }

                    //Set problem node as right child's left child
                    rightChild.children[0] = problemNodeL;

                    //Now we need to do a right rotation but the nodeStack node is the problem node
                    AVLNode problemNode = nodeStack.next();

                    problemNode.children[0] = null;
                    //Set rightChild's right child as problem node's left child
                    if (rightChild.children[1] != null) {
                        AVLNode rightChildsRightChild = (AVLNode) rightChild.children[1];
                        rightChild.children[1] = null;
                        problemNode.children[0] = rightChildsRightChild;
                    }

                    //Set problem node as right child's right child
                    rightChild.children[1] = problemNode;

                    //Make sure that the right child is now connected to problem node's parents
//                    if (Integer.signum(problemNode.key.compareTo(nodeStack.peek().key)) == -1) {
//                        nodeStack.peek().children[0] = null;
//                        nodeStack.peek().children[0] = rightChild;
//                    }
//                    else {
//                        nodeStack.peek().children[0] = null;
//                        nodeStack.peek().children[1] = rightChild;
//                    }
                    if (nodeStack.hasWork()) {
                        AVLNode parent = nodeStack.peek();
                        if (Integer.signum(key.compareTo(parent.key)) == -1) {
                            parent.children[0] = null;
                            parent.children[0] = rightChild;
                        }
                        else {
                            parent.children[1] = null;
                            parent.children[1] = rightChild;
                        }
                    }

                    //Update everyone's heights
                    problemNodeL.height = getHeight(problemNodeL);
                    problemNode.height = getHeight(problemNode);
                    rightChild.height = getHeight(rightChild);

                    super.root = rightChild;

                }
                //The insertion is a right left and we do a left right rotation
                else {
                    //First do a left rotation
                    AVLNode problemR = (AVLNode) nodeStack.peek().children[1];
                    AVLNode leftChild = (AVLNode) problemR.children[0];

                    problemR.children[0] = null;
                    //Set leftChild's right child as problemR's left child
                    if (leftChild.children[1] != null) {
                        AVLNode leftChildsRightChild = (AVLNode) leftChild.children[1];
                        leftChild.children[1] = null;
                        problemR.children[0] = leftChildsRightChild;
                    }

                    //Set problemR as leftchild's right child
                    leftChild.children[1] = problemR;

                    //Now it's time to do the right rotation
                    AVLNode problemNode = nodeStack.next();

                    problemNode.children[1] = null;
                    //Set leftchild's left children as problem node's right children
                    if (leftChild.children[0] != null) {
                        AVLNode leftChildsLeftChild = (AVLNode) leftChild.children[0];
                        leftChild.children[0] = null;
                        problemNode.children[1] = leftChildsLeftChild;
                    }

                    //Make left child as overall root and set problem node as its left child
                    leftChild.children[0] = problemNode;

                    //Connect parents of problem node to left child
                    if (nodeStack.hasWork()) {
                        AVLNode parent = nodeStack.peek();

                        if (Integer.signum(problemNode.key.compareTo(parent.key)) == -1) {
                            parent.children[0] = null;
                            parent.children[0] = leftChild;
                        }
                        else {
                            parent.children[1] = null;
                            parent.children[1] = leftChild;
                        }
                    }

                    //Update all the heights
                    problemR.height = getHeight(problemR);
                    problemNode.height = getHeight(problemNode);
                    leftChild.height = getHeight(leftChild);

                    super.root = leftChild;

                }

            }
            else {
                //Set node height and continue
                nodeStack.peek().height = Math.max(leftHeight, rightHeight) + 1;
                super.root = nodeStack.next();
            }

        }
        return value;
    }

    private int getHeight (AVLNode node) {
        int leftHeight = -1;
        int rightHeight = -1;

        if (node.children[0] != null) {
            AVLNode leftChild = (AVLNode) node.children[0];
            leftHeight = leftChild.height;
        }
        if (node.children[1] != null) {
            AVLNode rightChild = (AVLNode) node.children[1];
            rightHeight = rightChild.height;
        }

        return Math.max(leftHeight, rightHeight) + 1;
    }


    public class AVLNode extends BSTNode {
        int height;
        public AVLNode(K key, V value) {
            super(key, value);
            height = 0;
        }
    }
}

